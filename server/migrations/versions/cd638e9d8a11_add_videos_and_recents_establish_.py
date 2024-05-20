"""add videos and recents, establish relationships

Revision ID: cd638e9d8a11
Revises: 885a7e68546c
Create Date: 2024-05-20 11:22:20.352291

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'cd638e9d8a11'
down_revision = '885a7e68546c'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('videos',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('youtube_id', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('recents',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('video_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name=op.f('fk_recents_user_id_users')),
    sa.ForeignKeyConstraint(['video_id'], ['videos.id'], name=op.f('fk_recents_video_id_videos')),
    sa.PrimaryKeyConstraint('id')
    )
    with op.batch_alter_table('rooms', schema=None) as batch_op:
        batch_op.add_column(sa.Column('video_id', sa.Integer(), nullable=True))
        batch_op.create_foreign_key(batch_op.f('fk_rooms_video_id_videos'), 'videos', ['video_id'], ['id'])

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('rooms', schema=None) as batch_op:
        batch_op.drop_constraint(batch_op.f('fk_rooms_video_id_videos'), type_='foreignkey')
        batch_op.drop_column('video_id')

    op.drop_table('recents')
    op.drop_table('videos')
    # ### end Alembic commands ###
