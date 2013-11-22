for N in `cat lines.txt`
do
  wget -O ../data/$N.json "http://express.heartrails.com/api/json?method=getStations&line=`echo $N | nkf -wMQ | tr = % | tr -d '\r'|tr -d '\n'|sed 's/%%/%/'`"
done
