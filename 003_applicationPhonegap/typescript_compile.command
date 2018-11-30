DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR
mkdir __tmp_compile
mkdir __tmp_compile/freeradios
tsc --out __tmp_compile/freeradios/freeradios.js typescript/__start__.ts
uglifyjs __tmp_compile/freeradios/freeradios.js -o __tmp_compile/freeradios/freeradios.min.js
cp __tmp_compile/freeradios/freeradios.min.js www/js/freeradios.min.js
rm -rf __tmp_compile