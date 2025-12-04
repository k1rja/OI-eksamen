<script setup>
const getHeroes = () => {
    fetch('https://odense-idreatspark-default-rtdb.europe-west1.firebasedatabase.app/heroes.json', {
        method: 'GET',
    })
    .then((response) => {
        return response.json();
    })
    .then((res) => {
        console.log(res);
    })
};

getHeroes();
</script>

<template>

</template>