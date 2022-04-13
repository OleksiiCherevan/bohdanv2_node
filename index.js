const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const {
    isValidUser,
    getUsers,
    addWork,
    getWorks,
    removeWorkByDateAndTime,
} = require("./src/db");
const {
    convertWorksToDateWorks,
    convertWorksToUsersWithPoints,
} = require("./src/util");
const { token } = require("./store/token.json");

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use("/login", (req, res, next) => {
    const { login, password } = req.body;
    isValidUser(login, password)
        .then((isValid) => {
            if (isValid) {
                res.send({
                    token: token,
                });
            } else {
                res.send({
                    token: "",
                });
            }
        })
        .catch((err) => {
            console.log(err);
            res.send({
                token: "",
            });
        });
});

app.get("/", (req, res) => {
    res.send("Hello world!")
})

app.get("/users", (req, res) => {
    getUsers()
        .then((users) => res.send(JSON.stringify(users)))
        .catch((e) => console.log(e));
});

app.post("/works", (req, res) => {
    let body = req.body;

    addWork(body);

    console.log(body);
});

app.get("/works", (req, res) => {
    getWorks()
        .then((works) => res.json(works))
        .catch((e) => {});
});

app.delete("/works", (req, res) => {
    const { date, time, name, points, workersToWork } = req.body;
    console.log(req.body);
    removeWorkByDateAndTime(date, time, name, points, workersToWork )
        .then((_res) => {
            res.json({ message: "OK" });
        })
        .catch(e => {
            res.json({ message: "NOT OK" })
        });
});

app.get("/date_works", (req, res) => {
    getWorks()
        .then((works) => {
            const dateWorks = convertWorksToDateWorks(works);
            res.json(dateWorks);
        })
        .catch((e) => {
            console.log(e);
        });
});

app.get("/users_with_points", (req, res) => {
    getWorks()
        .then((works) => {
            convertWorksToUsersWithPoints(works)
                .then((usersWithPoints) => res.json(usersWithPoints))
                .catch(console.log);
        })
        .catch((e) => {
            console.log(e);
        });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
