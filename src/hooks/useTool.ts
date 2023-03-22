import { ref } from "vue";

let isSort = ref(false);
function useSort() {
  function setSort() {
    isSort.value = !isSort.value;
  }
  return { isSort, setSort };
}

export { useSort };
