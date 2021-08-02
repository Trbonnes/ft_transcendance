import { Middleware } from "@nuxt/types"

const authRedirectionMiddleware: Middleware = ({store, redirect}) => {
	if (!store.state.auth.loggedIn) {
		return redirect('login');
	}	
}