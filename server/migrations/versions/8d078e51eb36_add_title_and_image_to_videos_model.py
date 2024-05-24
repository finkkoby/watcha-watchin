"""add title and image to videos model

Revision ID: 8d078e51eb36
Revises: e708dcfbe1ba
Create Date: 2024-05-23 14:41:36.042623

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '8d078e51eb36'
down_revision = 'e708dcfbe1ba'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('_alembic_tmp_videos')
    with op.batch_alter_table('videos', schema=None) as batch_op:
        batch_op.add_column(sa.Column('title', sa.String(), nullable=True))
        batch_op.add_column(sa.Column('image_url', sa.String(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('videos', schema=None) as batch_op:
        batch_op.drop_column('image_url')
        batch_op.drop_column('title')

    op.create_table('_alembic_tmp_videos',
    sa.Column('id', sa.INTEGER(), nullable=False),
    sa.Column('youtube_id', sa.VARCHAR(), nullable=True),
    sa.Column('title', sa.VARCHAR(), nullable=False),
    sa.Column('image_url', sa.VARCHAR(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###