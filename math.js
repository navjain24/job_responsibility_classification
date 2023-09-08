function dotProduct(arrayA, arrayB){
    if(arrayA.length != arrayB.length)
    {
        throw new Error(`Lengths (${arrayA.length} and ${arrayB.length}) do not match`);
    }

    let product = 0;
    for(let i=0;i<arrayA.length;i++){
        product += arrayA[i] * arrayB[i];
    }
    return product;
}

function magnitude(array){
    let sum = 0;
    for (let i = 0;i<array.length;i++){
        sum += array[i] * array[i];
    }
    return Math.sqrt(sum);
}

export function cosineSimilarity(arrayA,arrayB){
    return dotProduct(arrayA,arrayB)/ (magnitude(arrayA) * magnitude(arrayB));
}