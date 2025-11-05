import { expect } from "chai";
import sinon from "sinon";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

// Load actual files
const { User } = require("../models/user.model.js");
const { registerUser, getUsers, getCurrentUser, userLogin } = require("../controllers/users.controller.js");
const jwtUtils = require("../auth/jwt.js");

describe("registerUser (Unit)", () => {
    let req, res, statusStub, jsonStub;

    beforeEach(() => {
        statusStub = sinon.stub()
        jsonStub = sinon.stub()

        req = { body: {name: "name", email: "email@gmail.com", password: "12345"} };
        res = { status: statusStub.returnsThis(), json: jsonStub };
    })

    afterEach(() => sinon.restore());

    it("should return 400 if any field is missing.", async() => {
        req.body = {}

        await registerUser(req, res)
        expect(statusStub.calledWith(400)).to.be.true;
        expect(jsonStub.calledWith({message: "All fields are required."})).to.be.true;
    })

    it("should return 200 and create a user", async () => {
        const fakeUser = { _id: "12345", name: "kamal", email: "e@g.com", password: "pass" };

        // Use resolves instead of returns
        sinon.stub(User, "create").resolves(fakeUser);

        await registerUser(req, res);

        expect(statusStub.calledWith(200)).to.be.true;

        const response = jsonStub.firstCall.args[0];
        expect(response.user).to.deep.equal(fakeUser);
        expect(response.message).to.equal("User registered successfully.");
    });

    it("should return 400 if email already exists", async() => {
        const duplicateError = new Error("Duplicate key error");
        duplicateError.code = 11000;

        sinon.stub(User, "create").rejects(duplicateError)

        await registerUser(req, res)
        expect(statusStub.calledWith(400)).to.be.true;
        const response = jsonStub.firstCall.args[0];
        expect(response).to.deep.equal({ message: "Email already exists" })
    })

    it("should return 400 on error", async() => {
        sinon.stub(User, "create").throws(new Error("DB failed."))

        await registerUser(req, res)
        expect(statusStub.calledWith(400)).to.be.true;
        expect(jsonStub.calledOnce).to.be.true;
    })

})

describe("getUsers (Unit)", () => {
    let req, res, statusStub, jsonStub;

    beforeEach(() => {
        statusStub = sinon.stub();
        jsonStub = sinon.stub();

        req = {};
        res = { status: statusStub.returnsThis(), json: jsonStub };
    })

    afterEach(() => sinon.restore());

    it("should return 200 and all the users", async() => {
        const fakeUsers =   [
                                {_id: "12345", name: "Rockkyy", email: "test1@example.com"},
                                {_id: "54321", name: "Jockkyy", email: "test2@example.com"}
                            ]

        const selectStub = sinon.stub().resolves(fakeUsers);
        sinon.stub(User, "find").returns({ select: selectStub });

        await getUsers(req, res)
        expect(statusStub.calledWith(200)).to.be.true;
        const response = jsonStub.firstCall.args[0]
        expect(response.users).to.deep.equal(fakeUsers)
        expect(response.message).to.equal("Users fetched successfully.")
    })
})

describe("getCurrentUser (Unit)", () => {
  let req, res, statusStub, jsonStub;

  beforeEach(() => {
    statusStub = sinon.stub();
    jsonStub = sinon.stub();

    req = { user: { id: "12345" } };
    res = { status: statusStub.returnsThis(), json: jsonStub };
  });

  afterEach(() => sinon.restore());

  it("should return 401 if user not logged in", async () => {
    req.user = {};

    await getCurrentUser(req, res);

    expect(statusStub.calledWith(401)).to.be.true;
    expect(jsonStub.calledWith({ message: "User not logged in." })).to.be.true;
  });

  it("should return 200 and user data when user is found", async () => {
    const fakeUser = { _id: "12345", name: "Rockkyy", email: "test@example.com" };

    // ✅ Stub the function directly (not replacing the module)
    const selectStub = sinon.stub().resolves(fakeUser);
    sinon.stub(User, "findById").returns({ select: selectStub });

    await getCurrentUser(req, res);

    expect(statusStub.calledWith(200)).to.be.true;
    const response = jsonStub.firstCall.args[0];
    expect(response.user).to.deep.equal(fakeUser);
    expect(response.message).to.equal("User fetched successfully.");
  });

  it("should return 400 on error", async () => {
    sinon.stub(User, "findById").throws(new Error("DB failed"));

    await getCurrentUser(req, res);

    expect(statusStub.calledWith(400)).to.be.true;
    expect(jsonStub.calledOnce).to.be.true;
  });
})

describe("userLogin (Unit)", () => {
    let req, res, statusStub, jsonStub;

    beforeEach(() => {
        statusStub = sinon.stub()
        jsonStub = sinon.stub()

        req = { body: { email: "e@g.com", password: "pass" }}
        res = { status: statusStub.returnsThis(), json: jsonStub }
    })

    afterEach(() => sinon.restore())

    it("should return 400 when no email or pass", async() => {
        req.body = {}

        await userLogin(req, res)
        expect(statusStub.calledWith(400)).to.be.true;
        const response = jsonStub.firstCall.args[0]
        expect(response.message).to.equal("All fields are required.")
    })

    it("should return 404 when user not found", async() => {

        sinon.stub(User, "findOne").resolves(null)

        await userLogin(req, res)
        expect(statusStub.calledWith(404)).to.be.true;
        const response = jsonStub.firstCall.args[0]
        expect(response.message).to.equal("User doesn't exist")
    })

    it("should return 401 for incorrect password", async() => {
        const fakeUser = {
            name: "name",
            email: "a@b.com",
            password: "wrong",
            comparePassword: sinon.stub().resolves(false)
        }

        sinon.stub(User, "findOne").resolves(fakeUser)

        await userLogin(req, res)
        expect(statusStub.calledWith(401)).to.be.true;
        const response = jsonStub.firstCall.args[0]
        expect(response.message).to.equal("Incorrect password")
    })

    // it("should call signAccessToken and return 200 with token and user data", async () => {
    //     // Arrange
    //     const fakeUser = {
    //         _id: "123",
    //         name: "Rockkyy",
    //         email: "rockkyy@example.com",
    //         comparePassword: sinon.stub().resolves(true),
    //     };

    //     sinon.stub(User, "findOne").resolves(fakeUser);
    //     const tokenStub = sinon.stub().returns("fake-token");
    //     sinon.replace(jwtUtils, "signAccessToken", tokenStub);

    //     // Act
    //     await userLogin(req, res);

    //     // Assert
    //     expect(tokenStub.calledOnce).to.be.true;
    //     expect(tokenStub.firstCall.args[0]).to.deep.equal({
    //         id: fakeUser._id,
    //         email: fakeUser.email,
    //         name: fakeUser.name,
    //     });

    //     const response = jsonStub.firstCall.args[0];
    //     expect(statusStub.calledWith(200)).to.be.true;
    //     expect(response.token).to.equal("fake-token");
    //     expect(response.user).to.deep.equal({
    //         id: fakeUser._id,
    //         name: fakeUser.name,
    //         email: fakeUser.email,
    //     });
    //     expect(response.message).to.equal("User logged in successfully.");
    // });

})


