import { A_Fragment } from "@adaas/a-concept";
import { A_Route } from "@adaas/a-server/entities/A-Route/A-Route.entity";



export class A_StaticConfig extends A_Fragment {

    readonly directories: Array<string>

    constructor(
        /**
         * Setup directories to serve static files from, comma separated
         */
        directories: string[] = []
    ) {
        super();

        this.directories = directories;
    }



    /**
     * Checks if a given path is configured in the proxy
     * 
     * @param path 
     * @returns 
     */
    has(path: string): false | string {

        const found = this.directories.find(dir => {
            return new RegExp(`^\/${dir.startsWith('/') ? dir.slice(1) : dir}/?.*`).test(path)
        });
        return !!found && found;
    }
}