<template>
    <div>
  <h1>add item</h1>
  <form>
  fruit:<el-input placeholder="Please input" v-model="fruit" value="fruit"></el-input>
  price:<el-input placeholder="Please input" v-model="price" value="price"></el-input>
  </form>
  <el-button type="primary" @click="add">Add</el-button>
</div>
</template>

<script>
import axios from 'axios';
export default {
    name: 'additem',
    data() {
        return{
        fruit: '',
        price: ''
        }
    },
    methods:{
       async add() {
           await axios.post('http://localhost:3001/additem', {
        fruit: this.fruit,
        price: this.price
    })
    .then((response) => {
      
        console.log('response data', response.data);
        let adddata = response.data.data
        // console.log('router =====>', this.$router)

        this.$router.push({name:'itemlist',params: { adddata }}) 
    })
    .catch(function (error) {
        console.log(error);
    });   
       }
       
    }
}
</script>

<style>

</style>
