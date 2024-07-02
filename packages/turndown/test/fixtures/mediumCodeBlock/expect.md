```
from typing import Sequence, TypeVar  
  
T = TypeVar('T')      # Declare type variable  
  
def first(l: Sequence\[T\]) -> T:   # Generic function  
    return l\[0\]
```

```
from typing import TypeVar, Generic, Iterable, Iterator  
List\_co = TypeVar('List\_co', covariant=True)class ImmutableList(Generic\[List\_co\]):    def \_\_init\_\_(self, items: Iterable\[List\_co\]) -> None:  
        ...  
        ...    def \_\_iter\_\_(self) -> Iterator\[List\_co\]:  
        ...  
        ...  
class Employee():  
    ...  
class Manager(Employee):  
    ...
```

```
function print() {  
 console.log("Hello World");  
}
```