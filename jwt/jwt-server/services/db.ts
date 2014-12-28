import mongoose = require("mongoose");

export class db {
    constructor(){
        //try {
        mongoose.connect('mongodb://localhost/psjwt', (err) => {
            if (err) {
                throw err;
            }
            console.log("mongodb connected!");
        });
        ////    console.log("mongodb connected!");
        //} catch (err) {
        //    if (err) {
        //        throw err;
        //    }
        //}        
    }

    public disconnect() {
        mongoose.disconnect();
    }
}