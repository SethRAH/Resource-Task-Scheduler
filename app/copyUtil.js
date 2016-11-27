function jsonCopy(obj){
    return JSON.parse(JSON.stringify(obj));
}

function objClone(obj){
    var copy;

    // Handle simple types/null/undefined
    if(null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(oj.getTime());
        return copy;
    }

    // Handle Array
    if(obj instanceof Array) {
        copy = [];
        for(var i = 0, len = obj.length; i < len; i++){
            copy[i] = objClone(obj[i]);
        }
        return copy;
    }

    // Handle object
    if(obj instanceof Object) {
        copy = {};
        for ( var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = objClone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to clone onj! Its type isn't supported.");
}