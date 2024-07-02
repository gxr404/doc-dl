1.  未指定列名：
    
    ```python
    l = [('Alice', 1)]
    spark_session.createDataFrame(l).collect()
    ```
    
    结果为：
    
    ```python
    [Row(_1=u'Alice', _2=1)] #自动分配列名
    ```
    
2.  指定列名：
    
    ```python
    l = [('Alice', 1)]
    spark_session.createDataFrame(l, ['name', 'age']).collect()
    ```
    
    结果为：
    
    ```python
    [Row(name=u'Alice', age=1)]
    ```
    
3.  通过字典指定列名：
    
    ```python
    d = [{'name': 'Alice', 'age': 1}]
    spark_session.createDataFrame(d).collect()
    ```
    
    结果为：
    
    ```python
    [Row(age=1, name=u'Alice')]
    ```