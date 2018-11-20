<template>
<div>
    <h1>{{ msg }}</h1>
    <!-- <el-input placeholder="Please input" v-model="input" class="demo-ruleForm"></el-input>
    <el-input placeholder="Please input" v-model="input" class="demo-ruleForm"></el-input>
    <el-input placeholder="Please input" v-model="input" class="demo-ruleForm"></el-input> -->
</div>
</template>

<script>
export default {
  name: 'home',
  data () {
    return {
      msg: '',
    }
  },
  methods: {}

}
</script>

<style>
.demo-ruleForm {
  width: 50%
}
</style>
