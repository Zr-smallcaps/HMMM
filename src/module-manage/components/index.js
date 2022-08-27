import pageTools from '../components/navbar.vue'
const components = [pageTools]
export default{
	install(Vue){
		components.forEach(component => {
	 	   Vue.component(component.name,component)
	 })
	}
}