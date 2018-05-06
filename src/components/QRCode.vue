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
                <label class='input-label'>Account:</label>
                <input class='input-label' placeholder="Account" v-model="account"/>
            </div>
            <div class='key-box'>
                <label class='input-label'>Key:</label>
                <textarea class='input-label' placeholder="Key" v-model='key' disabled='disabled'/>
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
  </div>
</template>

<script>
import VueQR from "vue-qr";
import util from '../js/util';

export default {
  name: "QRCode",
  data() {
    return {
        key: '',
        account: 'john@example.com',
        issuer:'Hello',
        // uri: '',
        authCode: '',
        stMark: '',
        leftSeconds:0,
    };
  },
  components: {
    VueQR
  },
  mounted(){
      this.stMark=setInterval(()=>{
          let timestamp=util.getCurrentTimestamp()
          this.leftSeconds=30-timestamp%30
          let nonce = parseInt(timestamp/30)
          this.authCode=util.genAuthCode(this.key,nonce)
      },1000)
      this.regenerate()
  },
  beforeDestroy(){
      clearInterval(this.stMark)
  },
  computed:{
      uri: function(){
          return `qbauth://totp/${this.issuer}:${this.account}?secret=${this.key}&issuer=${this.issuer}&algorithm=SHA1&digits=6&period=30`
      },
  },
  methods:{
      regenerate: function(){
          util.newKey()
          .then(key=>{
              this.key=key
              console.log(this.key, this.account, this.issuer)
          })
        //   this.uri=`qbauth://totp/${this.issuer}:${this.account}?secret=${this.key}&issuer=${this.issuer}&algorithm=SHA1&digits=6&period=30`
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

