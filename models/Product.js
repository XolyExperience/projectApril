import fs from 'fs';

const productsStr = fs.readFileSync('./data/products.json', 'utf-8');
let products = JSON.parse(productsStr);

const randStr = () => { 
    const lettersAsString = `A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,0,1,2,3,4,5,6,7,8,9`; 
    const letters = lettersAsString.split(','); 
    let randStr = ''; 
    for(let i = 0; i < 40; i++) {
         randStr += letters[Math.floor(Math.random() * letters.length)]; }; 
        return randStr; };

function findAll() {
    return products;
}

function findById(id) {
    return products.find(prod => prod.id === id);
}

function createProduct(body) {
    try {
        const newProduct = {
            id: randStr(),
            name: body.name || "untitled",
            description: body.description || "No description",
            price: body.price || 99,
        };
        products.push(newProduct);
        fs.writeFileSync('.data/products.json', JSON.stringify(products), 'UTF-8')
        return true;
    } catch(error) {
        console.log(error);
        return false;
    }
}

export default {findAll, findById, createProduct};