//"use strict";
//module model.service {

//    export class Customers { 
//        _q: any;
//        _http: ng.IHttpService;
//        _log: any;
//        public getAllCustomers(): any {

//            var deferred = this._q.defer();
            
//            this._http.get("/api/customer/").success(function (data, status, header, config) {
//                deferred.resolve(data);
//            })
//                .error(function (data, status, header, config) {
//                    this._log.warn(data, status, header, config);
//                    deferred(status);
//                });
//            return deferred.promise;
//        }

//        public getCustomer(id: number): any{
//            var deferred = this._q.defer();

//            this._http.get("/api/customer/"+id).success(function (data, status, header, config) {
//                deferred.resolve(data);
//            })
//                .error(function (data, status, header, config) {
//                    this._log.warn(data, status, header, config);
//                    deferred(status);
//                });
//            return deferred.promise;
//        }


//        public createCustomer(cust:model.Customer): any {
//            var deferred = this._q.defer();

//            this._http.post("/api/customer/",cust).success(function (data, status, header, config) {
//                console.log("postCustomer ... success");
//                deferred.resolve(data);
//            })
//                .error(function (data, status, header, config) {
//                    this._log.warn(data, status, header, config);
//                    deferred(status);
//                });
//            return deferred.promise;
//        }

//        public updateCustomer(cust: model.Customer): any {
//            var deferred = this._q.defer();

//            this._http.put("/api/customer/" + cust.CustomerId, cust).success(function (data, status, header, config) {
//                console.log("putCustomer ... success");
//                deferred.resolve(data);
//            })
//                .error(function (data, status, header, config) {
//                    this._log.warn(data, status, header, config);
//                    deferred(status);
//                });
//            return deferred.promise;
//        }

//        public deleteCustomer(id: number): any {
//            var deferred = this._q.defer();

//            this._http.delete("/api/customer/" + id).success(function (data, status, header, config) {
//                console.log("deleteCustomer ... success");
//                deferred.resolve(data);
//            })
//                .error(function (data, status, header, config) {
//                    this._log.warn(data, status, header, config);
//                    deferred(status);
//                });
//            return deferred.promise;
//        }

//        constructor($http, $q, $log) {
//            this._http = $http;
//            this._q = $q;
//            this._log = $log;
            
//            console.log("customersService ... loaded"); 
//        } 

//    }
//}

//app.ng.factory("customersService", ($http, $q, $log) => {
//    return new model.service.Customers($http, $q, $log);
//});