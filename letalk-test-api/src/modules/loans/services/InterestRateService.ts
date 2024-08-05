export default class InterestRateService {
    static getInterestRate(uf: String) {

        switch (uf.toUpperCase()){
            default: throw new Error("Estado inválido ou indisponível")
            case "MG":return 0.01
            case "SP":return 0.008
            case "RJ":return 0.009
            case "ES":return 0.0111
        }
    }
}