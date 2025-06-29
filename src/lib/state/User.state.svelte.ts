import { goto } from "$app/navigation";
import { ROUTES } from "$lib/consts/routes";

class User {
    private _id: number = $state(0);

    private _isAuthenticated: boolean = $state(false);
    
    public userName:string = $state("");

    get id() {
        return this._id;
    }
    set id(value: number) {
        if(this._id) return
        this._id = value;
    }
    get isAuthenticated() {
        return this._isAuthenticated;
    }
    set isAuthenticated(value: boolean) {
        if(this._isAuthenticated) return
        this._isAuthenticated = value;
    }
    async logout(){
        console.log(this);
        
        if(!this._isAuthenticated) return
        console.log('Logging out user with id:', this._id);
        
        const results = await fetch('/api/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        if(results.ok) {
            this._id = 0;
            this._isAuthenticated = false;
            this.userName = "";
            goto(ROUTES.LOGIN);
        }
    }
}
export const user = new User();