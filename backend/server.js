const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const session = require("express-session");
const cors = require("cors");
app.use(cors({ origin: "*", methods: "GET,HEAD,PUT,PATCH,POST,DELETE"}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(
	session({
		secret: "some secret key here",
		resave: true,
		saveUninitialized: false, 
	})
);
const pool = require("./db_connection");

app.get('/user/:id', (req, res) => {
    const accountId = req.params.id;
    const getAccountSql = 'SELECT * FROM account WHERE id = ?';
    pool.query(getAccountSql, accountId, (error, results) => {
        if (error) {
            console.log(error);
            res.send({ success: false });
        } else {
            res.send({ success: true, account: results[0] });
        }
    });
});

app.post('/user/signup', (req, res) => {
    const { username, password, dashboardList } = req.body;
    const addAccountSql = 'INSERT INTO account (username, password, dashboard_list) VALUES (?, ?, ?)';
    pool.query(addAccountSql, [username, password, JSON.stringify(dashboardList)], (error, results) => {
        if (error) {
            console.log(error);
            res.send({success : false});
        } else {
            res.send({ success: true, account: results[0] });
        }
    });
    req.session.loggedin = true;
    req.session.username = username;
    req.redirect("/");
});

app.post('/user/login', (req, res) => {
    if (req.session.loggedin) {
		res.status(401).send("Already logged in.");
	 	return;
	}
    const { username, password } = req.body;
    const getAccountSql = 'SELECT * FROM account WHERE username = ?';
    pool.query(getAccountSql, username, (error, results) => {
        if (error) {
            console.log(error);
            res.send({ success: false });
        } else {
            if (password === results[0].password) {
                res.send({ success: true, account: results[0] });
                req.session.loggedin = true;
		        req.session.username = username;
		        res.redirect("/");
            } else {
                res.status(401).send("Unauthorized, invalid password");
            }
        }
    });
});

app.post('/user/logout', (req, res) => {
    if (req.session.loggedin) {
		req.session.loggedin = false;
		req.session.username = "";
		res.redirect("/");
	} else {
		res.status(401).send("Not logged in");
		return;
	}
});

app.put('/user/:id', (req, res) => {
    const accountId = req.params.id;
    const { username, password, dashboardList } = req.body;
    const editAccountSql = 'UPDATE account SET username = ?, password = ?, dashboard_list = ? WHERE id = ?';
    pool.query(editAccountSql, [username, password, JSON.stringify(dashboardList), accountId], (error, results) => {
        if (error) {
            console.log(error);
            res.send({success : false});
        } else {
            console.log(results);
            res.send({ success: true, account: results[0] });
        }
    });
});

app.get('/dashboard/:id', (req, res) => {
    const dashboardId = req.params.id;
    const getDashboardSql = 'SELECT * FROM dashboard WHERE id = ?';
    pool.query(getDashboardSql, dashboardId, (error, results) => {
        if (error) {
            console.log(error);
            res.send({success : false});
        } else {
            res.send({ success: true, dashboard: results[0] });
        }
    });
});

app.post("/dashboard/add", (req, res) => {
    const { name, description, blockList, accountId } = req.body;
    const addDashboardSql = 'INSERT INTO dashboard (name, description, block_list, account_id) VALUES (?, ?, ?, ?)';
    pool.query(addDashboardSql, [name, description, blockList, accountId], (error, results) => {
        if (error) {
            console.log(error);
            res.send({success : false});
        } else {
            res.send({ success: true, dashboard: results[0] });
        }
    });
});

app.put('/dashboard/edit/:id', (req, res) => {
    const dashboardId = req.params.id;
	const name = req.body.name;
	const description = req.body.description;
	const blockList = req.body.blockList;
    const editDashboardSql = 'UPDATE dashboard SET name = ?, description = ?, block_list = ? WHERE id = ?';
    pool.query(editDashboardSql, [name, description, JSON.stringify(blockList), dashboardId], (error, results) => {
        if (error) {
            console.log(error);
            res.send({success : false});
        } else {
            console.log(results);
            res.send({ success: true, dashboard: results[0] });
        }
    });
});

app.get('/block/:id', (req, res) => {
	const blockId = req.params.id;
	const getBlockSql = 'SELECT * FROM block WHERE id = ?';
	pool.query(getBlockSql, blockId, (error, results) => {
	  if (error) {
		console.log(error);
		res.send({success : false});
	  } else {
		res.send({ success: true, block: results[0] });
	  }
	});
  });
  
app.post('/block/add', (req, res) => {
	const { title, dashboardId, ordinal, variableList } = req.body;
	const addBlockSql = 'INSERT INTO block (title, dashboard_id, ordinal, variable_list) VALUES (?, ?, ?, ?)';
	pool.query(addBlockSql, [title, dashboardId, ordinal, JSON.stringify(variableList)], (error, results) => {
		if (error) {
		console.log(error);
		res.send({success : false});
		} else {
		res.send({ success: true, block: results[0] });
		}
	});
});

app.put('/block/edit/:id', (req, res) => {
	const blockId = req.params.id;
	const { title, dashboardId, ordinal, variableList } = req.body;
	const editBlockSql = 'UPDATE block SET title = ?, dashboard_id = ?, ordinal = ?, variable_list = ? WHERE id = ?';
	pool.query(editBlockSql, [title, dashboardId, ordinal, JSON.stringify(variableList), blockId], (error, results) => {
	  if (error) {
		console.log(error);
		res.send({success : false});
	  } else {
		console.log(results);
		res.send({ success: true, block: results[0] });
	  }
	});
});

app.get('/variable/:id', (req, res) => {
    const variableId = req.params.id;
    const getVariableSql = 'SELECT * FROM variable WHERE id = ?';
    pool.query(getVariableSql, variableId, (error, results) => {
        if (error) {
            console.log(error);
            res.send({success : false});
        } else {
            res.send({ success: true, variable: results[0] });
        }
    });
});

app.post('/variable/add', (req, res) => {
    const { name, description, type, value, blockId, ordinal } = req.body;
    const addVariableSql = 'INSERT INTO variable (name, description, type, value, block_id, ordinal) VALUES (?, ?, ?, ?, ?, ?)';
    pool.query(addVariableSql, [name, description, type, value, blockId, ordinal], (error, results) => {
        if (error) {
            console.log(error);
            res.send({success : false});
        } else {
            res.send({ success: true, variable: results[0] });
        }
    });
});

app.put('/variable/edit/:id', (req, res) => {
    const variableId = req.params.id;
    const { name, description, type, value, blockId, ordinal } = req.body;
    const editVariableSql = 'UPDATE variable SET name = ?, description = ?, type = ?, value = ?, block_id = ?, ordinal = ? WHERE id = ?';
    pool.query(editVariableSql, [name, description, type, value, blockId, ordinal, variableId], (error, results) => {
        if (error) {
            console.log(error);
            res.send({success : false});
        } else {
            console.log(results);
            res.send({ success: true, variable: results[0] });
        }
    });
});
