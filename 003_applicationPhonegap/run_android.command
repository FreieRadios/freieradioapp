DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR
./typescript_compile.command
phonegap build android
phonegap run android