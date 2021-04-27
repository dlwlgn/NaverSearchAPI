<template>
<div class="main-container">
    <Form></Form>
    <bar-chart v-if="chartData" :chart-data="chartData"/>
</div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import BarChart from '../components/ReactiveBarChart.js';
import Form from '../components/Form.vue';
export default {
    components:{
        BarChart,
        Form
    },
    data() {
        return {
            // chartData: null
        }
    },
    //mapState는 computed에서 가져온다.
    computed:{
        ...mapState(['chartData'])
    },
    methods: {
        // action이 아닌 방식의 action 호출하는 법
        // this.$store.dispatch로도 호출 가능
        ...mapActions(["generateChartData"]),
        generateData() {
            let newArray = [];
            let newArray2 = [];

            for (let i = 0; i < 10; i++) {
                let randomValue = Math.floor(Math.random() * 10);
                newArray.push(randomValue);
            }
            for (let i = 0; i < 10; i++) {
                let randomValue = Math.floor(Math.random() * 10);
                newArray2.push(randomValue);
            }
            this.chartData = {
                labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
                datasets: [
                    {
                        label: "Data One",
                        backgroundColor: "#f87979",
                        data: newArray,
                        fill: false
                    },
                    {
                        label: "Data two",
                        backgroundColor: "black",
                        data: newArray2,
                        fill: false
                    }
                ]
            }
        }
    },
    async mounted() {
        // this.generateData();
        // setInterval(this.generateData, 2000);
        this.generateChartData();
    }
}
</script>

<style>
    .main-container {
        display: flex;
        padding: 20px;
        /* width:85vw; */
        /* justify-content:space-between; */
    }
    .main-container > * {
        /* flex:40%; */
        flex: 1;
    }
</style>