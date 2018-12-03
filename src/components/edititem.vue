<template>
<div>
  <h1>edit item</h1>
  <form>
  fruit:<el-input placeholder="Please input" v-model="fruit" value="fruit"></el-input>
  price:<el-input placeholder="Please input" v-model="price" value="price"></el-input>
  </form>
  <el-button type="primary" @click="updatevalue">Update</el-button>
</div>
</template>

<script>
import axios from 'axios';
export default {
    name: 'edititem',
    data() {
        return{
           fruit: '',
           price: ''
        }
    },
    mounted () {
    },
    created() {
     console.log(this.$route.params.row.fruit)
     this.fruit = this.$route.params.row.fruit
     console.log('this.fruit', this.fruit)
     this.price = this.$route.params.row.price
     console.log('this.price', this.price)
    },
    methods: {
        updatevalue(fruit) {
            console.log('edit id',this.$route.params.row._id)
            console.log(this.fruit,this.price)
            let obid = this.$route.params.row._id
            const url = `http://localhost:3001/editItem/${obid}`;
            axios.put(url,{
                fruit: this.fruit,
                price: this.price
            })
    .then((response) => {
        console.log('response', response)
        
        this.$router.push('/itemlist')
    }).catch((error) =>{
        console.log(error)
    });
        }
        
    }
}
</script>

<style>

</style>
