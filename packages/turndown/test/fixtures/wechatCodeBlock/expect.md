```ruby
>>> df['generation'].unique()
array(['Generation X', 'Silent', 'G.I. Generation', 'Boomers', 'Millenials', 'Generation Z'], dtype=object)
>>> df['country'].nunique()
101
```

可以用 describe() 输出每一列不同的统计数据（例如最小值、最大值、平均值、总数等），如果指定 include='all'，会针对每一列目标输出唯一元素的数量和出现最多元素的数量；

```python
def log_head(df, head_count=10): 
    print(df.head(head_count)) 
    return df

def log_columns(df): 
    print(df.columns) 
    return df

def log_shape(df): 
    print(f'shape = {df.shape}') 
    return df
```