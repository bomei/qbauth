import sjcl from './sjcl.js';

class Util{
    newKeyUrl='http://localhost:3001/mongo/key'


    genAuthCode(password, nonce, algorithm){
        console.debug(password,nonce,algorithm)
        let hash = sjcl.hash.sha1
        if (algorithm === 'SHA256'){
            hash = sjcl.hash.sha256
        }
        let hmac=new sjcl.misc.hmac(this.str2BitArray(password), hash)
        // let _toEncrypt=this.str2BitArray(String(nonceInput)+'+'+raw)
        let _toEncrypt=this.str2BitArray(String(nonce))
        let ba=hmac.encrypt(_toEncrypt)
        let result = {
            hex: this.bitArray2Hex(ba),
            bitArray: ba
        }
        let hex=result.hex
        let start=parseInt(hex[hex.length-1],16)
        let bigInt = parseInt(hex.slice(start,start+8),16)
        let code = bigInt%1000000
        return this.leftFill(code)
    }

    leftFill(data){
        data=String(data)
        let base=Array.from('000000')
        for(let i=0;i<data.length;++i){
            base[base.length-1-i]=data[data.length-1-i]
        }
        return base.join('')
    }

    str2BitArray(data){
        return sjcl.codec.utf8String.toBits(data)
    }

    bitArray2Hex(data){
        return sjcl.codec.hex.fromBits(data)
    }

    getCurrentTimestamp(){
        let nonce = parseInt(new Date().valueOf()/1000)
        return nonce
    }
    

    genKey(issuer, account){
        let nonce = this.getCurrentTimestamp()
        let hash= sjcl.hash.sha1.hash(issuer+account+nonce)
        let hex=sjcl.codec.base32hex.fromBits(hash)
        return hex
    }

    newKey(){
        return fetch(this.newKeyUrl,{method:'POST'})
        .then(resp=>resp.json())
        .then(res=>{return res})
        .catch(err=>console.log(err))
    }
}

let util=new Util()

export default util
