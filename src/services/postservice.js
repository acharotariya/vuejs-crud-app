import Api from '@/services/Api'

export default {
  fetchPosts () {
    return Api().get('posts')
  },
  addpost() {
    return Api().post('posts')
  }
}
