import Vue from 'vue'
import Vuex from 'vuex'
import { dataLap } from '../utils/axios'

Vue.use(Vuex)

function makeColor(){
  return "#" + Math.round(Math.random()*0xffffff).toString(16);
}

export default new Vuex.Store({
  state: {
    chartData: ""
  },
  mutations: {
    CHANGE_CHART_DATA(state, data) {
      state.chartData = data
    }
  },
  // 비동기 처리를 할때 actions에서 처리하고
  // commit을 통해 mutations에 보내서 state를 변경
  actions: {
    async generateChartData({ commit }) {
      //백엔드에서 get 요청을 받아와서 result에 저장
      //axios로 연결되어있는 dataLap

      const result = await dataLap.get();

      // console.log(result);

      const chartData = {
        //labels에는 날짜가 들어가야 한다. x축임
        //콘솔값을 뒤져보면 period에 날짜값이 있다.

        //날짜는 data[0]이든 [1]이든 같은 값을 나타낸다.
        labels: result.data[0].data.map(li => li.period),
        datasets: result.data.reduce((acc, cur) => {
          let label = cur.title;
          let data = cur.data.map(li => li.ratio);
          let borderColor = makeColor();
          let backgroundColor = makeColor();
          acc.push({label: label, data, borderColor, backgroundColor, fill:false});
          return acc;
        }, [])
      }
      commit("CHANGE_CHART_DATA", chartData);
    }
  },
  modules: {
  }
})
