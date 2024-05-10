"""create rooms table, add room and user relationship

Revision ID: f890ecc4b8d5
Revises: a3227727e7cc
Create Date: 2024-05-10 13:51:46.073400

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f890ecc4b8d5'
down_revision = 'a3227727e7cc'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('rooms',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('code', sa.String(length=5), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('code')
    )
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(sa.Column('room_id', sa.String(), nullable=True))
        batch_op.create_foreign_key(batch_op.f('fk_users_room_id_rooms'), 'rooms', ['room_id'], ['id'])

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.drop_constraint(batch_op.f('fk_users_room_id_rooms'), type_='foreignkey')
        batch_op.drop_column('room_id')

    op.drop_table('rooms')
    # ### end Alembic commands ###