if(!Array.prototype.indexOfConditional){
    Array.prototype.indexOfConditional = function(searchConditional, fromIndex) {

        if (this == null) {
            throw new TypeError('"this" is null or not defined');
        }

        var o = Object(this);

        var len = o.length >>> 0;

        if(len === 0){
            return -1;
        }

        var n = fromIndex | 0;

        if (n >= len){
            return -1;
        }

        var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

        while (k < len){
            if(k in o && searchConditional(o[k])){
                return k;
            }

            k++;
        }

        return -1;
    };
}