<template>
  <div class='qr-code'>
    <div class='top-box'>
        <div class='row-box'>
            <VueQR :text='uri' :size='250'></VueQR>
        </div>
        <div class='row-box'>
            <div class='input-box'>
                <label class='input-label'>Issuer:</label>
                <input class='input-label' placeholder="Issuer" v-model="issuer"/>
            </div>
            <div class="input-box">
                <label class='input-label'>Label:</label>
                <input class='input-label' placeholder="Label" v-model="label"/>
            </div>
            <div class="input-box">
                <label class='input-label'>Digits:</label>
                <input class='input-label' placeholder="6" v-model="digits"/>
            </div>
            <div class="input-box">
                <label class='input-label'>Period:</label>
                <input class='input-label' placeholder="30" v-model="period" />
            </div>
            <div class="input-box">
                <label class='input-label'>Algorithm:</label>
                <input class='input-label' placeholder="SHA1" v-model="algorithm" disabled='disabled'/>
            </div>
            <div class='key-box'>
                <label class='input-label'>Secret:</label>
                <textarea class='input-label' placeholder="Key" v-model='secret' disabled='disabled'/>
            </div>
            <div class='input-box'>
                <button v-on:click='regenerate'>Regenerate</button>
            </div>
            
        </div>
    </div>
    <div class='uri-box'>
        <p>{{uri}}</p>
    </div>
    <div class='auth-code-box'>
        <span class='auth-code'>{{authCode}}</span>
        <span>left: {{leftSeconds}}</span>
    </div>
    <div class='auth-code-box'>
        <div class='input-box'>
            <label class='input-label'>Enter code:</label>
            <input class='input-label' v-model="enteredCode"/>
            <button class="input-box" v-on:click='check'>Check!</button>
        </div>
    </div>
  </div>
</template>

<script>
import VueQR from "vue-qr";
import util from '../js/util';
const OTPAuth=require('otpauth')


export default {
  name: "QRCode",
  data() {
    return {
        secret: '',
        label: 'john@example.com',
        issuer:'Hello',
        digits:6,
        period:30,
        uri: '',
        authCode: '',
        stMark: '',
        leftSeconds:0,
        algorithm:'SHA1',
        enteredCode:'',
    };
  },
  components: {
    VueQR
  },
  mounted(){
      this.stMark=setInterval(()=>{
          let timestamp=util.getCurrentTimestamp()
          this.leftSeconds=this.period-timestamp%this.period
          let nonce = parseInt(timestamp/this.period)
          this.authCode=this.totp.generate()
      },1000)
      this.regenerate()
  },
  beforeDestroy(){
      clearInterval(this.stMark)
  },
  computed:{
      totp(){
          return new OTPAuth.TOTP({
              issuer:this.issuer,
              label:this.label,
              algorithm:this.algorithm,
              digits:this.digits,
              period:this.period,
              secret:OTPAuth.Secret.fromB32(this.secret)
          })
      }
  },
  methods:{
      regenerate: function(){
            let key=util.newKey(this.issuer,this.label)
            if(key ===''){
                alert('empty key, try again')
            }
            else
                this.secret=key.toUpperCase()
            console.log(this.secret, this.account, this.issuer)
            this.uri=this.totp.toString()
            // this.uri=`otpauth://totp/${this.issuer}:${this.account}?secret=${this.key}&issuer=${this.issuer}&algorithm=${this.algorithm}&digits=${this.digits}&period=${this.period}`
          
      },
    check:function(){
        util.checkCode(`${this.issuer}:${this.account}`,this.enteredCode)
        .then(res=>{
            if(res){
                alert('Code accepted!')
            }
            else{
                alert('Code not accepted!')
            }
        })
    }
  }
};
</script>

<style scoped>
.qr-code {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
}

.top-box {
  /* background-color: red; */
  height: 400px;
  width: 800px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: row;
}

.row-box{
    display: flex;
    flex-flow: column;
    width: 400px;
    justify-content: center;
    align-items: center;
}

.input-box{
    display: flex;
    height: 30px;
}

.input-label{
    font-size: 20px;
}

.key-box{
    display: flex;
}

.uri-box{
    display: flex;
}

.auth-code{
    font-size: 180px;
}
</style>

