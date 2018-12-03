<template>
<div>
    <el-button class="edit" type="primary" @click="additem">Add Item</el-button>
    <el-table
    :data="tableData"
    border
    current-change
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
        <!-- {{scope}} -->
        <!-- {{scope.row}}{{scope}} -->
       <el-button class="edit" type="primary" @click="openeditroute(scope.row)">Edit</el-button>
       <el-button type="danger" @click="deleteitem(scope.row,scope.$index)">Delete</el-button>
      </template>
    </el-table-column>
  </el-table>

  <!-- Add fruit dialog pop up modal
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
</el-dialog> -->

  <div class="col-md-8">
              <template>
                <paginate
                  v-model="page"
                  :page-count=totalPages
                  :margin-pages="0"
                  :page-range="5"
                  :prev-text="'Prev'"
                  :next-text="'Next'"
                  :click-handler="clickCallback"
                  :container-class="'pagination'"
                  :page-class="'page-item'"
                  :page-link-class="'page-link-item'"
                  :prev-class="'ignore prev-item'"
                  :prev-link-class="'prev-link-item'"
                  :next-class="'ignore next-item'"
                  :next-link-class="'next-link-item'"
                  :disabled-class="'ignore disabled'"
                ></paginate>
              </template>
            </div>

<!-- edit fruit dialog pop up modal -->
  <!-- <el-dialog title="Edit fruit" :visible.sync="edititemdialog" :data=tableData>
    <template slot-scope="item">
  <el-form>
    <el-form-item label="fruit" :label-width="formLabelWidth">
      <el-input value="item.fruit" autocomplete="off"></el-input>
    </el-form-item>
     <el-form-item label="price" :label-width="formLabelWidth">
      <el-input  value="item.price" autocomplete="off"></el-input>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="edititemdialog = false">Cancel</el-button>
    <el-button type="primary" @click="updateitem">Update Item</el-button>
  </span>
    </template>
</el-dialog> -->
</div>
</template>

<script>
import axios from 'axios';
import Paginate from 'vuejs-paginate'
export default {
    name: 'itemlist',
    data() {
        return {
        tableData: [],
        form: {
          fruit: '',
          price: ''
        },
        edititemdialog: true,
        dialogFormVisible: false,
        formLabelWidth: '120px',
        numberOfProductsPerPage: 5,
        totalPages: Number,
        page: 1
        }
    },
    components: {
    Paginate
  },
    created () {
    axios.get(`http://localhost:3001/getitem`)
    .then(response => {
        console.log('res', response.data)
        //  this.tableData = response.data
        let totalProductsCount = response.data.length
        // console.log('totalProductsCount', totalProductsCount)
        // console.log('this.numberOfProductsPerPage', this.numberOfProductsPerPage)
        this.totalPages = Math.ceil(totalProductsCount / this.numberOfProductsPerPage)
        console.log('this.totalPages', this.totalPages)
        axios.get(`http://localhost:3001/getitem`,{params:{
          page: 0,
          limit: this.numberOfProductsPerPage
        }}).then((response)=>{
              this.tableData = response.data
        }).catch((err)=> {this.errors.push(e)})
      
    })
    .catch(e => {
      this.errors.push(e)
    })
  },
  mounted() {
      console.log('mm',this.$route.params)
      let dd = []
      dd.push(this.$route.params.adddata)
      this.tableData = dd
  },
  methods: {
     additem() {
        console.log("additem called")
          // event.preventDefault();
        //   console.log('fruit', this.form.fruit)
        //    console.log('price', this.form.price)
        / this.$router.push({name:'additem'}) 
    },

    openeditroute(row){
      // console.log('row',row)
      this.$router.push( { name: 'edititem', params: { row }})
    },
    deleteitem(row,index) {
      console.log('index', index)
           let obid = row._id
            const url = `http://localhost:3001/deleteItem/${obid}`;
            axios.delete(url,{
            })
    .then((response) => {
        console.log('response', response)
        this.tableData.splice(index, 1)
        // this.$parent.refresh()
        this.$router.push('/itemlist')
    }).catch((error) =>{
        console.log(error)
    });
    },
    clickCallback (pageNum) {
      console.log('pageNum', pageNum)
      let pageindex = pageNum - 1
      axios.get(`http://localhost:3001/getitem`,{params:{
          page: pageindex,
          limit: this.numberOfProductsPerPage
        }}).then((response)=>{
          this.tableData = response.data
        }).catch((err)=>{
          console.log(err)
        })
      // this.fromItemNumber = (this.numberOfProductsPerPage * (pageNum - 1) + 1)
      // console.log('this.fromItemNumber', this.fromItemNumber)
      // this.filterrecords()
    },
    filterrecords() {
      axios.get()
    }


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
.pagination {

}
.page-item {
}
</style>
