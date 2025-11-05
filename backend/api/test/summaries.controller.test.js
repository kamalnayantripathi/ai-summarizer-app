import { expect } from "chai";
import sinon from "sinon";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const apiClient = require('../config/apiClient.js')
const { Summary } = require('../models/summary.model.js')
const { createSummary, saveSummary, getSummaries, getSummary, updateSummary, deleteSummary } = require('../controllers/summary.controller.js')

describe("createSummary (Unit)", () => {
    let req, res, statusStub, jsonStub;
    beforeEach(() => {
        statusStub = sinon.stub()
        jsonStub = sinon.stub()

        req = { body: { article: "Some article."}}
        res = { status: statusStub.returnsThis(), json: jsonStub }
    })

    afterEach(() => sinon.restore())

    it("should return 400 if article is not present.", async() => {
        req.body = {}

        await createSummary(req, res)
        expect(statusStub.calledWith(404)).to.be.true;
        const response = jsonStub.firstCall.args[0];
        expect(response.message).to.equal("article is required.")
    })

    it("should return 200 and summary on success", async () => {
        const fakeResponse = {
        data: [{ summary_text: "This is a summarized version." }],
        };

        sinon.stub(apiClient, "post").resolves(fakeResponse);
        await createSummary(req, res)

        expect(statusStub.calledWith(200)).to.be.true;
        const response = jsonStub.firstCall.args[0];
        expect(response.summary).to.equal("This is a summarized version.");
        expect(response.message).to.equal("Summary created successfully.");
    })

})

describe("saveSummary (Unit)", () => {
    let req, res, statusStub, jsonStub;

    beforeEach(() => {
        statusStub = sinon.stub()
        jsonStub = sinon.stub()

        req = { body: { article: "Article", summaryText: "Summary"}}
        res = { status: statusStub.returnsThis(), json: jsonStub }
    })

    afterEach(() => sinon.restore())

    it("should return 404 saying all fields are required", async() => {
        req.body = {}

        await saveSummary(req, res)
        expect(statusStub.calledWith(404)).to.be.true;
        const response = jsonStub.firstCall.args[0];
        expect(response.message).to.equal("All fields are required.")
    })

    it("should return 200 and the created summary", async() => {
        req.user = { name: "fake user" }

        const fakeArticle = { article: "Article", summaryText: "Summary", createdBy: req.user.name}

        sinon.stub(Summary, "create").resolves(fakeArticle)
        await saveSummary(req, res)
        expect(statusStub.calledWith(200)).to.be.true;
        const response = jsonStub.firstCall.args[0];
        expect(response.message).to.equal("Summary created successfully.")
    })
})


describe("getSummaries (Unit)", () => {
    let req, res, statusStub, jsonStub;
    beforeEach(() => {
        statusStub = sinon.stub()
        jsonStub = sinon.stub()

        req = {}
        res = { status: statusStub.returnsThis(), json: jsonStub }
    })

    afterEach(() => sinon.restore())

    it("should get all summaries", async() => {
        const fakeSummaries = [{ article: "Article1", summaryText: "Summary1", createdBy: "User1"}]
        sinon.stub(Summary, "find").resolves(fakeSummaries)
        await getSummaries(req, res)
        expect(statusStub.calledWith(200)).to.be.true;
        const response = jsonStub.firstCall.args[0];
        expect(response.message).to.equal("Summaries fetched successfully.")
    })

    it("should throw 400 on error", async() => {
        sinon.stub(Summary, "find").throws("Error")

        await saveSummary(req, res)
        expect(statusStub.calledWith(400)).to.be.true;
        expect(jsonStub.calledOnce).to.be.true;
    })
})

describe("getSummary (Unit)", () => {
    let req, res, statusStub, jsonStub;

    beforeEach(() => {
        statusStub = sinon.stub()
        jsonStub = sinon.stub()

        req = { params: { id: "id" }}
        res = { status: statusStub.returnsThis(), json: jsonStub }
    })

    afterEach(() => sinon.restore())

    it("should throw 401, when summary not found", async() => {
        req.params = {}

        sinon.stub(Summary, "findById")
        await getSummary(req, res)
        expect(statusStub.calledWith(401)).to.be.true;
        const response = jsonStub.firstCall.args[0];
        expect(response.message).to.equal("Summary not found.")
    })

    it("should return 200 with summary", async() => {
        const fakeSummary = { article: "Article", summaryText: "Summary", createdBy: "User"}
        
        sinon.stub(Summary, "findById").resolves(fakeSummary)
        await getSummary(req, res)
        expect(statusStub.calledWith(200)).to.be.true;
        const response = jsonStub.firstCall.args[0];
        expect(response.message).to.equal("Summary fetched successfully.")
    })
})


describe("updateSummary (Unit)", () => {
    let req, res, statusStub, jsonStub;

    beforeEach(() => {
        statusStub = sinon.stub()
        jsonStub = sinon.stub()

        req = { params: { id: "id" }, body: { summaryText: "Summary", article: "Article" }}
        res = { status: statusStub.returnsThis(), json: jsonStub }
    })

    afterEach(() => sinon.restore())

    it("throws 401, when summary not found.", async() => {
        sinon.stub(Summary, "findById").resolves(null)
        await updateSummary(req, res)

        expect(statusStub.calledWith(401)).to.be.true;
        const response = jsonStub.firstCall.args[0];
        expect(response.message).to.equal("Summary not found.")
    })

    it("returns 200 along with summary found.", async() => {
        const fakeSummary = { 
            article: "Article", 
            summaryText: "Summary", 
            createdBy: "User",
            save: sinon.stub().resolvesThis(),
        }

        sinon.stub(Summary, "findById").resolves(fakeSummary)
        await updateSummary(req, res)

        expect(statusStub.calledWith(200)).to.be.true;
        const response = jsonStub.firstCall.args[0];
        expect(response.message).to.equal("Summary updated successfully.")
    })
})

describe("deleteSummary (Unit)", () => {
    let req, res, statusStub, jsonStub;

    beforeEach(() => {
        statusStub = sinon.stub()
        jsonStub = sinon.stub()

        req = { params: {id: "id"} }
        res = { status: statusStub.returnsThis(), json: jsonStub }
    })

    afterEach(() => sinon.restore())

    it("returns 401, when summary couldn't be deleted.", async() => {
        sinon.stub(Summary, "findByIdAndDelete").resolves(null)

        await deleteSummary(req, res)
        expect(statusStub.calledWith(401)).to.be.true;
        const response = jsonStub.firstCall.args[0];
        expect(response.message).to.equal("Couldn't delete summary.")
    })

    it("returns 200 with the deleted summary.", async() => {
        const fakeSummary = { article: "Article", summaryText: "Summary", createdBy: "User"}

        sinon.stub(Summary, "findByIdAndDelete").resolves(fakeSummary)

        await deleteSummary(req, res)
        expect(statusStub.calledWith(200)).to.be.true;
        const response = jsonStub.firstCall.args[0];
        expect(response.message).to.equal("Summary deleted successfully.")
    })
})