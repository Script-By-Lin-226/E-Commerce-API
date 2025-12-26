"""initial

Revision ID: aa7191adbd59
Revises: efb6bc628e66
Create Date: 2025-12-26 14:06:30.618882

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'aa7191adbd59'
down_revision: Union[str, Sequence[str], None] = 'efb6bc628e66'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
