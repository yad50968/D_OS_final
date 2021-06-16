var abi = fetch('https://weippig.github.io/mypage/Contract_ABI', {
      method: 'GET',
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      return data;
    })
