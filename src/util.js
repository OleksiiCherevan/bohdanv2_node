// const groupUsersWithDefaultPoints = require("./../store/291g.json")
const db = require("./db")

const getWorksByDate = (works = [], date) => {
    return works.filter((work) => work.date === date);
};

const convertWorksToDateWorks = (works = []) => {
    const setAllDates = new Set(works.map((work) => work.date));
    const arrAllDates = [...setAllDates];

    const convertedWorks = arrAllDates.map((date) => {
        return {
            date,
            time_works: getWorksByDate(works, date),
        };
    });

    return convertedWorks;
};

const convertWorksToUsersWithPoints = async (works = []) => {
    console.log("works convert users:" , works);
    const allTimeWorksWithPoints = works.map((work, index, arr) => {
        return { points: work.points, workers: [...work.workersToWork] };
    });

    // const users = allTimeWorksWithPoints.reduce(
    //     (prev, current) => [...prev, ...current.workers],
    //     []
    // );

    // const uniqueUsers = [
    //     ...new Map(users.map((item) => [item["userName"], item])).values(),
    // ];

    // const initialUserNamesWithPoints = uniqueUsers.map((user) => {
    //     return { ...user, points: 0 };
    // });

    const response = await db.getUsers()
    console.log("response" ,response);
    const initialUserNamesWithPoints = response

    for (let i = 0; i < initialUserNamesWithPoints.length; i++) {
        const element = initialUserNamesWithPoints[i];
        const name = element.userName;

        allTimeWorksWithPoints.forEach((work) => {
            work.workers.forEach((worker) => {
                if (worker.userName === name) {
                    initialUserNamesWithPoints[i].points += work.points;
                }
            });
        });
    }
    return initialUserNamesWithPoints;
};

module.exports = { convertWorksToDateWorks, convertWorksToUsersWithPoints };
