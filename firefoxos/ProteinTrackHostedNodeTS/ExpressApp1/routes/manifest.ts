/*
 * GET home page.
 */
import express = require('express');


export function manifest(req: express.Request, res: express.Response) {
    res.render('manifest');
};