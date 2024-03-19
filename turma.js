import Aluno from "./aluno";

class turma extends turmaPresencial{

    #codigo 
    #nota

    constructor ({codigo,nota}){
        this.#codigo = codigo
        this.#nota = nota
    }

    aprovado(){
        if(nota >= 6){
            return true;
        }else{
            return false;
        }
    }
}