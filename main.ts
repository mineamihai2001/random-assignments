import Generator from "./generator.ts";

const args = Deno.args;

if(args.length < 2) {
    console.log("run like: deno run main.ts <values.txt> <name1, name2, ..., nameN>");
    Deno.exit(1);
}

const file:string = args[0];
if(!Generator.validateSource(file)) {
    console.log(`>>> the source file ${file} does't exist or is not readable`);
    Deno.exit(2);    
}


const generator = new Generator(args[0], args.slice(1));

await generator.run();
generator.print()