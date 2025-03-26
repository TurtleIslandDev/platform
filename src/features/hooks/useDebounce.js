const useDebounce=()=>{

    function debounce(func, delay) {
        let timerId;
        return function(...args) {
            if (timerId) {
                clearTimeout(timerId);
            }
            timerId = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    }
    return{
        debounce
    }
}
export default useDebounce