from django.db.backends.base.base import BaseDatabaseWrapper
from django.db.backends.mysql.features import DatabaseFeatures

# Save the original method
original_check_database_version_supported = BaseDatabaseWrapper.check_database_version_supported

def bypassed_check(self):
    if self.vendor == 'mysql':
        return
    return original_check_database_version_supported(self)

# Apply the version patch
BaseDatabaseWrapper.check_database_version_supported = bypassed_check

# Modern Django uses properties or 'can_return_columns_from_insert' 
# Setting these properties ensures it covers all variations
DatabaseFeatures.can_return_columns_from_insert = property(lambda self: False)
DatabaseFeatures.can_return_rows_from_bulk_insert = property(lambda self: False)
DatabaseFeatures.has_returning_fields = property(lambda self: False)
