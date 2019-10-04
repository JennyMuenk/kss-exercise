# InfluxDB 
Create training:
```
curl -G http://localhost:8086/query --data-urlencode "q=CREATE DATABASE training"
```

Get databases:
```
curl -G http://localhost:8086/query --data-urlencode "q=GET DATABASES"
```

Inserting into DB:
```
curl -i -X POST 'http://localhost:8086/write?db=mydb' --data-binary 'cpu_load_short,host=server01,region=us-west value=0.64 1434055562000000000'

```

Get all:
```
curl -G http://localhost:8086/query --data-urlencode "q=SELECT * FROM motion" --data-urlencode "db=training"
```

Drop:
```
curl -X POST http://localhost:8086/query --data-urlencode "q=DROP SERIES FROM motion" --data-urlencode "db=training"
```
