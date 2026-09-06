function getExchangeRate() {
    return fetch("https://api.frankfurter.dev/v2/rate/USD/ILS")
        .then(response => response.json())
        .then(data => {
            return data.rate
        })
}