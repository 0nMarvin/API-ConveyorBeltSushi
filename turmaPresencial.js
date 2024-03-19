class turmaPresencial{
    #frequencia

    constructor(frequencia){
        this.#frequencia = frequencia; 
    }

    aprovado(){
        if(frequencia < 7.5){
            return true
        }

        return false;
    }
}