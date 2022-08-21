const request = require("supertest");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { app } = require("../src/app");
const User = require("../src/models/user");

const adminUserOneId = new mongoose.Types.ObjectId();
const adminUserOne = {
  _id: adminUserOneId,
  first_name: "Admin",
  last_name: "User",
  email: "admin1@gmail.com",
  password: "Thisisatest3$",
  phone_number: "12345678910",
  country: "Egypt",
  city: "Cairo",
  gender: "Female",
  isAdmin: true,
  tokens: [
    {
      token: jwt.sign({ _id: adminUserOneId }, process.env.JWT_SECRET),
    },
  ],
};
const normalUserOneId = new mongoose.Types.ObjectId();
const normalUserOne = {
  _id: normalUserOneId,
  first_name: "normal",
  last_name: "userOne",
  email: "user1@gmail.com",
  password: "Thisisatest3$",
  phone_number: "12345678910",
  country: "Egypt",
  city: "Cairo",
  gender: "Male",
  tokens: [
    {
      token: jwt.sign({ _id: normalUserOneId }, process.env.JWT_SECRET),
    },
  ],
};

beforeEach(async () => {
  await User.deleteMany();
  await new User(adminUserOne).save();
  await new User(normalUserOne).save();
});

test("Should sign up a new user", async () => {
  const response = await request(app)
    .post("/signup")
    .send({
      first_name: "normal",
      last_name: "userTwo",
      email: "userTwo@gmail.com",
      password: "Thisisatest3$",
      phone_number: "12345678910",
      country: "Egypt",
      city: "Cairo",
      gender: "Male",
    })
    .expect(201);

  const user = User.findById(response.body.user._id);
  expect(user).not.toBeNull();
});

// test("Should sign in admin", async () => {
//   await request(app)
//     .post("/login")
//     .send({ email: adminUserOne.email, password: adminUserOne.password })
//     .expect(200);
// });

test("Should not login nonexistent user", async () => {
  await request(app)
    .post("/login")
    .send({ email: "hello@email.com", password: "123easdfEW#" })
    .expect(400);
});

test("Should get profile with same id as admin", async () => {
  await request(app)
    .get(`/users/${adminUserOne._id}`)
    .set("Authorization", `Bearer ${adminUserOne.tokens[0].token}`)
    .send()
    .expect(200);
});
test("Should get user profile as admin", async () => {
  await request(app)
    .get(`/users/${normalUserOneId}`)
    .set("Authorization", `Bearer ${adminUserOne.tokens[0].token}`)
    .send()
    .expect(200);
});
test("Should get user profile with same id", async () => {
  await request(app)
    .get(`/users/${normalUserOneId}`)
    .set("Authorization", `Bearer ${normalUserOne.tokens[0].token}`)
    .send()
    .expect(200);
});
test("Should fail user accessing another profile", async () => {
  await request(app)
    .get(`/users/${adminUserOneId}`)
    .set("Authorization", `Bearer ${normalUserOne.tokens[0].token}`)
    .send()
    .expect(403);
});
test("Should fail as admin accessing non existing user", async () => {
  await request(app)
    .get("/users/123")
    .set("Authorization", `Bearer ${adminUserOne.tokens[0].token}`)
    .send()
    .expect(404);
});
