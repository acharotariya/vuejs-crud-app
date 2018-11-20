<template>
<div>
    <el-button class="edit" type="primary" @click="dialogFormVisible = true">Add Book</el-button>
    <el-table
    :data="tableData"
    border
    style="width: 100%">
    <el-table-column
      prop="fruit"
      label="fruit"
      width="180"
      align="center">
    </el-table-column>
    <el-table-column
      prop="price"
      label="price"
      width="180"
      align="center">
    </el-table-column>
    <el-table-column
      prop="operation"
      label="operation"
      >
      <template slot-scope="scope">
       <el-button class="edit" type="primary" @click="edititemdialog = true">Edit</el-button>
       <el-button type="danger" @click="deleteitem">Delete</el-button>
      </template>
    </el-table-column>
  </el-table>

  <!-- Add fruit dialog pop up modal -->
  <el-dialog title="Add fruit" :visible.sync="dialogFormVisible">
  <el-form :model="form">
    <el-form-item label="fruit" :label-width="formLabelWidth">
      <el-input v-model="form.fruit" autocomplete="off"></el-input>
    </el-form-item>
     <el-form-item label="price" :label-width="formLabelWidth">
      <el-input v-model="form.price" autocomplete="off"></el-input>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">Cancel</el-button>
    <el-button type="primary" @click="additem" >Add Item</el-button>
  </span>
</el-dialog>

<!-- edit fruit dialog pop up modal -->
  <el-dialog title="Edit fruit" :visible.sync="edititemdialog">
  <el-form :model="form">
    <el-form-item label="fruit" :label-width="formLabelWidth">
      <el-input v-model="form.fruit" autocomplete="off"></el-input>
    </el-form-item>
     <el-form-item label="price" :label-width="formLabelWidth">
      <el-input v-model="form.price" autocomplete="off"></el-input>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="edititemdialog = false">Cancel</el-button>
    <el-button type="primary" @click="updateitem">Update Item</el-button>
  </span>
</el-dialog>
</div>
</template>

<script>
import axios from 'axios';
export default {
    name: 'booklist',
    data() {
        return {
        tableData: [],
        dialogFormVisible: false,
        edititemdialog: false,
        form: {
          fruit: '',
          price: ''
        },
        formLabelWidth: '120px'
        }
    },
    created () {
    axios.get(`http://localhost:3001/getitem`)
    .then(response => {
        console.log('res', response.data)
      this.tableData = response.data
    })
    .catch(e => {
      this.errors.push(e)
    })
  },
  watcher: {
      
  },
  methods: {
     async additem(event) {
        console.log("additem called")
          event.preventDefault();
          console.log('fruit', this.form.fruit)
           console.log('price', this.form.price)
        await axios.post('http://localhost:3001/additem', {
        fruit: this.form.fruit,
        price: this.form.price
    })
    .then((response) => {
        console.log('response data', response.data);
        console.log('router =====>', this.$router)
        this.tableData = response.data
        // this.$router.push({name:'booklist'}) 
    })
    .catch(function (error) {
        console.log(error);
    });   
    },

  //  async edititem(event) {
  //       console.log("edititem called")
  //         event.preventDefault();
  //         console.log('fruit', this.form.fruit)
  //          console.log('price', this.form.price)
  //       await axios.post('http://localhost:3001/additem', {
  //       fruit: this.form.fruit,
  //       price: this.form.price
  //   })
  //   .then((response) => {
  //       console.log('response data', response.data);
  //       console.log('router =====>', this.$router)
  //       this.tableData = response.data
  //       // this.$router.push({name:'booklist'}) 
  //   })
  //   .catch(function (error) {
  //       console.log(error);
  //   });   
  //   },

  }
}
</script>

<style>
.edit {
    align-content: center
}
</style>
