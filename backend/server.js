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
const path = require("path");
const { Block, Variable } = require('../frontend/dashboard');


// Define middleware to check whether user is authenticated
const requireAuth = (req, res, next) => {
    if (req.session.loggedin) {
      next(); // User is authenticated, so proceed to the next middleware/route handler
    } else {
      res.redirect('/login'); // User is not authenticated, so redirect to login page
    }
  };

// Route handlers
// Home page
app.get("/", (request, response) => {
    const filePath = path.join(__dirname, "../frontend/homepage.html");
    response.status(200).sendFile(filePath);
});
// Login page
app.get("/login", (request, response) => {
    const filePath = path.join(__dirname, "../frontend/login.html");
    response.status(200).sendFile(filePath);
});
// Sign up page
app.get("/signup", (request, response) => {
    const filePath = path.join(__dirname, "../frontend/signup.html");
    response.status(200).sendFile(filePath);
});

// Restricted pages that require authentication
// Dashboard list page
app.get("/dashboardList", requireAuth, (request, response) => {
    const filePath = path.join(__dirname, "../frontend/dashboard_list.html");
    response.status(200).sendFile(filePath);
});
// View dashboard page
app.get("/myDashboard", requireAuth, (request, response) => {
    const id = request.query.dashboardId;
    const filePath = path.join(__dirname, "../frontend/afficher_dashboard.html");
    response.status(200).sendFile(filePath);
});
// Create dashboard page
app.get("/createDashboard", requireAuth, (request, response) => {
    const filePath = path.join(__dirname, "../frontend/create_dashboard.html");
    response.status(200).sendFile(filePath);
});
// Create block page
app.get("/createBlock", requireAuth, (request, response) => {
    const filePath = path.join(__dirname, "../frontend/create_block.html");
    response.status(200).sendFile(filePath);
});
// Create variable page
app.get("/createVariable", requireAuth, (request, response) => {
    const filePath = path.join(__dirname, "../frontend/create_variable.html");
    response.status(200).sendFile(filePath);
});
// Edit block page
app.get("/editBlock", requireAuth, (request, response) => {
    const filePath = path.join(__dirname, "../frontend/edit_block.html");
    response.status(200).sendFile(filePath);
});
// Edit dashboard page
app.get("/editDashboard", requireAuth, (request, response) => {
    const id = request.query.id;
    const filePath = path.join(__dirname, "../frontend/edit_dashboard.html");
    response.status(200).sendFile(filePath);
});
// CSS
app.get("/style", (request, response) => {
    const filePath = path.join(__dirname, "../frontend/style.css");
    response.status(200).sendFile(filePath);
});
app.get("/createBlock", (request, response) => {
    const filePath = path.join(__dirname, "../frontend/create_block.css");
    response.status(200).sendFile(filePath);
});
app.get("/header", (request, response) => {
    const filePath = path.join(__dirname, "../frontend/header.css");
    response.status(200).sendFile(filePath);
});
app.get("/create", (request, response) => {
    const filePath = path.join(__dirname, "../frontend/create_dashboard.css");
    response.status(200).sendFile(filePath);
});
// JS
app.get("/functions.js", (request, response) => {
    const filePath = path.join(__dirname, "../frontend/functions.js");
    response.status(200).sendFile(filePath);
  });
  
app.get("/dashboard.js", (request, response) => {
    const filePath = path.join(__dirname, "../frontend/dashboard.js");
    response.status(200).sendFile(filePath);
});
app.get("/createVariable.js", (request, response) => {
    const filePath = path.join(__dirname, "../frontend/create_variable.js");
    response.status(200).sendFile(filePath);
});
app.get("/createBlock.js", (request, response) => {
    const filePath = path.join(__dirname, "../frontend/create_block.js");
    response.status(200).sendFile(filePath);
});
app.get("/create_dashboard.js", (request, response) => {
    const filePath = path.join(__dirname, "../frontend/create_dashboard.js");
    response.status(200).sendFile(filePath);
});

// Endpoints
app.get('/user/logout', (req, res) => {
    if (req.session.loggedin) {
		req.session.loggedin = false;
		req.session.username = "";
		res.redirect("/");
	} else {
		res.status(401).send("Not logged in");
		return;
	}
});

app.get('/user', (req, res) => {
    if (req.session.loggedin) {
        console.log(req.session.username);
		res.send({ success : true, username: req.session.username});
	} else {
		res.status(401).send("Not logged in");
		return;
	}
});

app.post('/user/signup', (req, res) => {
    const { email, password } = req.body;
    const addAccountSql = 'INSERT INTO account (username, password) VALUES (?, ?)';
    pool.query(addAccountSql, [email, password], (error, results) => {
        if (error) {
            console.log(error);
            res.send({success : false});
        } else {
            req.session.loggedin = true;
            req.session.username = email;
            res.redirect("/dashboardList");
        }
    });
});

app.post('/user/login', (req, res) => {
    if (req.session.loggedin) {
		res.status(401).send("Already logged in.");
	 	return;
	}
    const { email, password } = req.body;
    const getAccountSql = 'SELECT * FROM account WHERE username = ?';
    pool.query(getAccountSql, email, (error, results) => {
        if (error) {
            console.log(error);
            res.send({ success: false });
        } else {
            if (password === results[0].password) {
                req.session.loggedin = true;
		        req.session.username = email;
                res.redirect("/dashboardList");
            } else {
                res.status(401).send("Unauthorized, invalid password");
            }
        }
    });
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
            res.send({ success: true, account: results[0] });
        }
    });
});

app.get('/user/dashboardList', (req, res) => {
    if (req.session.loggedin) {
        const username = req.session.username;
        const getDashboardListSql = 'SELECT dashboard_list FROM account WHERE username = ?';
        pool.query(getDashboardListSql, username, (error, results) => {
            if (error) {
                console.log(error);
                res.send({ success: false });
            } else {
                const dashboardList = JSON.parse(results[0].dashboard_list);
                res.send({ success: true, dashboardList });
            }
        });
    } else {
        res.status(401).send("Not logged in");
    }
});

app.get('/user/id', (req, res) => {
    if (req.session.loggedin) {
        const username = req.session.username;
        const getUserIdSql = 'SELECT id FROM account WHERE username = ?';
        pool.query(getUserIdSql, username, (error, results) => {
            if (error) {
                console.log(error);
                res.send({ success: false });
            } else {
                const id = JSON.parse(results[0].id);
                res.send({ success: true, id });
            }
        });
    } else {
        res.status(401).send("Not logged in");
    }
});

app.get('/dashboard/:id', (req, res) => {
    const dashboardId = req.params.id;
    const getDashboardSql = 'SELECT * FROM dashboard WHERE id = ?';
    const getBlocksSql = 'SELECT * FROM block WHERE dashboard_id = ?';
    const getVariablesSql = 'SELECT * FROM variable WHERE block_id IN (SELECT id FROM block WHERE dashboard_id = ?)';
  
    pool.query(getDashboardSql, dashboardId, (error, dashboardResults) => {
        if (error) {
            console.log(error);
            res.send({ success: false });
        } else {
            const dashboard = dashboardResults[0];
            dashboard.block_list = JSON.parse(dashboard.block_list);
            pool.query(getBlocksSql, dashboardId, (error, blocksResults) => {
                if (error) {
                    console.log(error);
                    res.send({ success: false });
                } else {
                    pool.query(getVariablesSql, [dashboardId, dashboardId], (error, variablesResults) => {
                        if (error) {
                            console.log(error);
                            res.send({ success: false });
                        } else {
                            const variableList = variablesResults.map(result => new Variable(result.id, result.name, result.type, result.value, result.block_id));
                            const blockList = [];
                            if (dashboard.block_list) {
                                for (let i = 0; i < dashboard.block_list.length; i++) {
                                    const blockId = dashboard.block_list[i];
                                    const blockResult = blocksResults.find(result => result.id === blockId);
                                    const newBlock = new Block(blockResult.id, blockResult.title, variableList.filter(variable => variable.blockId === blockId), blockResult.dashboard_id);
                                    blockList.push(newBlock);
                                }
                                dashboard.block_list = blockList.map(newBlock => newBlock.id);
                                res.send({ success: true, dashboard, blockList });
                            } else {
                                res.send({ success: true, dashboard });
                            }
                            
                        }
                    });
                }
            });
        }
    });
});

app.post("/dashboard/add", (req, res) => { 
    if (req.session.loggedin) {
        const username = req.session.username;
        const getUserIdSql = 'SELECT * FROM account WHERE username = ?';
        let dashboardList;
        pool.query(getUserIdSql, username, (error, accountResults) => {
            if (error) {
                console.log(error);
                res.send({ success: false });
            } else {
                const accountId = parseInt(accountResults[0].id);
                dashboardList = JSON.parse(accountResults[0].dashboard_list) || [];
                const { name, description } = req.body;
                const addDashboardSql = 'INSERT INTO dashboard (name, description, account_id) VALUES (?, ?, ?)';
                pool.query(addDashboardSql, [name, description, accountId], (error, results) => {
                    if (error) {
                        console.log(error);
                        res.send({success : false});
                    } else {
                        const dashboardId = results.insertId;
                        if (!dashboardList.includes(dashboardId)) {
                            dashboardList.push(dashboardId);
                        }
                        const updateQuery = 'UPDATE account SET dashboard_list = ? WHERE id = ?';
                        pool.query(updateQuery, [JSON.stringify(dashboardList), accountId], (error, results) => {
                            if (error) {
                                console.log(error);
                                res.send({success : false});
                            } else {
                                res.send({ success: true, dashboardId });                            
                            }
                        });
                    }
                });
            }
        });
    } else {
        res.status(401).send("Not logged in");
    }
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
            res.send({ success: true, dashboard: results[0] });
        }
    });
});

app.put('/dashboard/updateBlockOrder/:id', (req, res) => {
    const dashboardId = req.params.id;
    const blockOrder = req.body.blockList;
    const newBlockOrder = blockOrder.map(Number);
    const updateBlockOrderSql = 'UPDATE dashboard SET block_list = ? WHERE id = ?';
    pool.query(updateBlockOrderSql, [JSON.stringify(newBlockOrder), dashboardId], (error, results) => {
        if (error) {
            console.log(error);
            res.send({success : false});
        } else {
            res.send({ success: true });
        }
    });
});

app.put('/dashboard/addBlock/:id', (req, res) => {
    const dashboardId = req.params.id;
    const blockId = parseInt(req.body.blockId);
    // Get the existing block list from the database
    const dashboardQuery = 'SELECT block_list FROM dashboard WHERE id = ?';
    pool.query(dashboardQuery, [dashboardId], (error, results) => {
        if (error) {
            console.log(error);
            res.send({success : false});
        } else {
            const blockList = JSON.parse(results[0].block_list) || [];
            // Add the new block ID to the block list
            if (!blockList.includes(blockId)) {
                blockList.push(blockId);
            }
            // Update the block list in the database
            const updateQuery = 'UPDATE dashboard SET block_list = ? WHERE id = ?';
            pool.query(updateQuery, [JSON.stringify(blockList), dashboardId], (error, results) => {
                if (error) {
                    console.log(error);
                    res.send({success : false});
                } else {
                    res.send({ success: true, dashboard: results[0] });
                }
            });
        }
    });
});

app.delete('/dashboard/:id', (req, res) => {
    const dashboardId = req.params.id;
    const getBlocksSql = 'SELECT * FROM block WHERE dashboard_id = ?';
    pool.query(getBlocksSql, dashboardId, (error, blockResults) => {
        if (error) {
            console.log(error);
            res.send({ success: false });
        } else {
            const blockIds = blockResults.map((block) => block.id);

            const deleteVariablesSql = 'DELETE FROM variable WHERE block_id IN (?)';
            pool.query(deleteVariablesSql, [blockIds], (error, variableResults) => {
                if (error) {
                    console.log(error);
                    res.send({ success: false });
                } else {
                    const deleteBlocksSql = 'DELETE FROM block WHERE dashboard_id = ?';
                    pool.query(deleteBlocksSql, dashboardId, (error, blockResults) => {
                        if (error) {
                            console.log(error);
                            res.send({ success: false });
                        } else {
                            const deleteDashboardSql = 'DELETE FROM dashboard WHERE id = ?';
                            pool.query(deleteDashboardSql, dashboardId, (error, dashboardResults) => {
                                if (error) {
                                    console.log(error);
                                    res.send({ success: false });
                                } else {
                                    const getAccountSql = 'SELECT * FROM account WHERE dashboard_list LIKE ?';
                                    const dashboardIdStr = `%${dashboardId}%`;
                                    pool.query(getAccountSql, dashboardIdStr, (error, accountResults) => {
                                        if (error) {
                                            console.log(error);
                                            res.send({ success: false });
                                        } else {
                                            const account = accountResults[0];
                                            const dashboardListArr = JSON.parse(account.dashboard_list);
                                            const dashboardIndex = dashboardListArr.indexOf(parseInt(dashboardId));
                                            if (dashboardIndex > -1) {
                                                dashboardListArr.splice(dashboardIndex, 1);
                                            }
                                            const newDashboardList = JSON.stringify(dashboardListArr);
                                            const updateAccountSql = 'UPDATE account SET dashboard_list = ? WHERE id = ?';
                                            pool.query(updateAccountSql, [newDashboardList, account.id], (error, results) => {
                                                if (error) {
                                                    console.log(error);
                                                    res.send({ success: false });
                                                } else {
                                                    res.send({ success: true });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});
  
app.get('/block/:id', (req, res) => {
    const blockId = req.params.id;
    const getBlockSql = 'SELECT * FROM block WHERE id = ?';
    const getVariablesSql = 'SELECT * FROM variable WHERE block_id = ?';
    pool.query(getBlockSql, blockId, (error, results) => {
        if (error) {
            console.log(error);
            res.send({ success: false });
        } else {
            const block = results[0];
            pool.query(getVariablesSql, blockId, (error, variablesResults) => {
                if (error) {
                    console.log(error);
                    res.send({ success: false });
                } else {
                    const variableList = variablesResults.map(result => new Variable(result.id, result.name, result.type, result.value, blockId));
                    block.variable_list = variableList;
                    res.send({ success: true, block });
                }
            });
        }
    });
});
  
app.post('/block/add', (req, res) => {
	const { title, dashboardId, variableList } = req.body;
	const addBlockSql = 'INSERT INTO block (title, dashboard_id, variable_list) VALUES (?, ?, ?)';
	pool.query(addBlockSql, [title, dashboardId, JSON.stringify(variableList)], (error, results) => {
		if (error) {
            console.log(error);
            res.send({success : false});
		} else {
		    res.send({ success: true, blockId: results.insertId });
		}
	});
});

app.put('/blockName/:id', (req, res) => {
	const blockId = req.params.id;
	const { title } = req.body;
	const editBlockSql = 'UPDATE block SET title = ? WHERE id = ?';
	pool.query(editBlockSql, [title, blockId], (error, results) => {
        if (error) {
            console.log(error);
            res.send({ success : false });
        } else {
            res.send({ success: true });
        }
	});
});

app.put('/block/addVariable/:id', (req, res) => {
    const blockId = req.params.id;
    const variableId = parseInt(req.body.variableId);
    // Get the existing variable list from the database
    const blockQuery = 'SELECT variable_list FROM block WHERE id = ?';
    pool.query(blockQuery, [blockId], (error, results) => {
        if (error) {
            console.log(error);
            res.send({success : false});
        } else {
            const variableList = JSON.parse(results[0].variable_list) || [];
            // Add the new variable ID to the variable list
            if (!variableList.includes(variableId)) {
                variableList.push(variableId);
            }
            // Update the block list in the database
            const updateQuery = 'UPDATE block SET variable_list = ? WHERE id = ?';
            pool.query(updateQuery, [JSON.stringify(variableList), blockId], (error, results) => {
                if (error) {
                    console.log(error);
                    res.send({success : false});
                } else {
                    res.send({ success: true, block: results[0] });
                }
            });
        }
    });
});

app.delete('/block/:id', (req, res) => {
    const blockId = req.params.id;
    const deleteVariablesSql = 'DELETE FROM variable WHERE block_id = ?';
    pool.query(deleteVariablesSql, blockId, (error, results) => {
        if (error) {
            console.log(error);
            res.send({ success: false });
        } else {
            const getDashboardSql = 'SELECT * FROM dashboard WHERE block_list LIKE ?';
            const blockIdStr = `%${blockId}%`;
            pool.query(getDashboardSql, blockIdStr, (error, results) => {
                if (error) {
                    console.log(error);
                    res.send({ success: false });
                } else {
                    const dashboard = results[0];
                    const blockListArr = JSON.parse(dashboard.block_list);
                    const blockIndex = blockListArr.indexOf(parseInt(blockId));
                    if (blockIndex > -1) {
                        blockListArr.splice(blockIndex, 1);
                    }
                    const newBlockList = JSON.stringify(blockListArr);
                    const updateDashboardSql = 'UPDATE dashboard SET block_list = ? WHERE id = ?';
                    pool.query(updateDashboardSql, [newBlockList, dashboard.id], (error, results) => {
                        if (error) {
                            console.log(error);
                            res.send({ success: false });
                        } else {
                            const deleteBlockSql = 'DELETE FROM block WHERE id = ?';
                            pool.query(deleteBlockSql, blockId, (error, results) => {
                                if (error) {
                                    console.log(error);
                                    res.send({ success: false });
                                } else {
                                    res.send({ success: true });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

app.put('/block/addVariable/:id', (req, res) => {
    const blockId = req.params.id;
    const variableId = parseInt(req.body.variableId);
    // Get the existing block list from the database
    const blockQuery = 'SELECT variable_list FROM block WHERE id = ?';
    pool.query(blockQuery, [blockId], (error, results) => {
        if (error) {
            console.log(error);
            res.send({success : false});
        } else {
            const variableList = JSON.parse(results[0].variable_list) || [];
            // Add the new block ID to the block list
            if (!variableList.includes(variableId)) {
                variableList.push(variableId);
            }
            // Update the block list in the database
            const updateQuery = 'UPDATE block SET variable_list = ? WHERE id = ?';
            pool.query(updateQuery, [JSON.stringify(variableList), blockId], (error, results) => {
                if (error) {
                    console.log(error);
                    res.send({success : false});
                } else {
                    res.send({ success: true, block: results[0] });
                }
            });
        }
    });
});

app.put('/block/updateVariableOrder/:id', (req, res) => {
    const blockId = req.params.id;
    const variableOrder = req.body.variableList;
    const newVariableOrder = variableOrder.map(Number);
    const updateVariableOrderSql = 'UPDATE block SET variable_list = ? WHERE id = ?';
    pool.query(updateVariableOrderSql, [JSON.stringify(newVariableOrder), blockId], (error, results) => {
        if (error) {
            console.log(error);
            res.send({success : false});
        } else {
            res.send({ success: true });
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
    const { name, type, value, blockId} = req.body;
    const addVariableSql = 'INSERT INTO variable (name, type, value, block_id) VALUES (?, ?, ?, ?)';
    pool.query(addVariableSql, [name, type, value, blockId], (error, results) => {
        if (error) {
            console.log(error);
            res.send({success : false});
        } else {
            res.send({ success: true, variableId: results.insertId });
        }
    });
});

app.put('/variableName/:id', (req, res) => {
    const variableId = req.params.id;
    const { name } = req.body;
    const editVariableSql = 'UPDATE variable SET name = ? WHERE id = ?';
    pool.query(editVariableSql, [name, variableId], (error, results) => {
        if (error) {
            console.log(error);
            res.send({ success : false });
        } else {
            res.send({ success: true, variable: results[0] });
        }
    });
});

app.put('/variableValue/:id', (req, res) => {
    const variableId = req.params.id;
    const { value } = req.body;
    const editVariableSql = 'UPDATE variable SET value = ? WHERE id = ?';
    pool.query(editVariableSql, [value, variableId], (error, results) => {
        if (error) {
            console.log(error);
            res.send({ success : false });
        } else {
            res.send({ success: true, variable: results[0] });
        }
    });
});

app.delete('/variable/:id', (req, res) => {
    const variableId = req.params.id;
    const getBlockSql = 'SELECT * FROM block WHERE variable_list LIKE ?';
    const variableIdStr = `%${variableId}%`;
    pool.query(getBlockSql, variableIdStr, (error, results) => {
        if (error) {
            console.log(error);
            res.send({ success: false });
        } else {
            const block = results[0];
            const variableListArr = JSON.parse(block.variable_list);
            const variableIndex = variableListArr.indexOf(parseInt(variableId));
            if (variableIndex > -1) {
                variableListArr.splice(variableIndex, 1);
            }
            const newVariableList = JSON.stringify(variableListArr);
            const updateBlockSql = 'UPDATE block SET variable_list = ? WHERE id = ?';
            pool.query(updateBlockSql, [newVariableList, block.id], (error, results) => {
                if (error) {
                    console.log(error);
                    res.send({ success: false });
                } else {
                    const deleteVariableSql = 'DELETE FROM variable WHERE id = ?';
                    pool.query(deleteVariableSql, variableId, (error, results) => {
                        if (error) {
                            console.log(error);
                            res.send({ success: false });
                        } else {
                            res.send({ success: true });
                        }
                    });
                }
            });
        }
    });
});
  
app.listen(3000, () => {
    console.log('Server listening on port 3000');
});