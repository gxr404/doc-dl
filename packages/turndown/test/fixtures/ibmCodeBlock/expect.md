```
$ dd if=/dev/zero of=file.img bs=1k count=10000
10000+0 records in
10000+0 records out
$
```

现在有了一个 10MB 的 file.img 文件。使用 `losetup` 命令将一个循环设备与这个文件关联起来，让它看起来像一个块设备，而不是文件系统中的常规文件：

```
$ losetup /dev/loop0 file.img
$
```

```
#include <linux/module.h>
/* Defines the license for this LKM */
MODULE_LICENSE("GPL");
/* Init function called on module entry */
int my_module_init( void )
{
  printk(KERN_INFO "my_module_init called.  Module is now loaded.\n");
  return 0;
}
/* Cleanup function called on module exit */
void my_module_cleanup( void )
{
  printk(KERN_INFO "my_module_cleanup called.  Module is now unloaded.\n");
  return;
}
/* Declare entry and exit functions */
module_init( my_module_init );
module_exit( my_module_cleanup );
```