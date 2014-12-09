/*
 * GET home page.
 */
import express = require('express');

class indexFormulaire {
    titletest: string;
}

export function index(req: express.Request, res: express.Response) {
    //res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    //res.header("Pragma", "no-cache");
    //res.header("Expires", 0);
    var param = new indexFormulaire();
    param.titletest = "valueDeTitleTestModifié";
    res.render('index', param);
};