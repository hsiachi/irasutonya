import os
import json
from sentence_transformers import SentenceTransformer
import numpy as np
from PIL import Image
import torch
import sys

def precompute_embeddings(dir, text_model, img_model, text_npy, img_npy):
    os.chdir(dir)
    data = []
    with open('./data_filtered.jsonl') as f:
        for line in f:
            a = json.loads(line)
            data.append(a)
            
    # print(os.getcwd())
    # os.chdir('..')
    # print(os.getcwd())

    print(f'image num:{len(data)}')
    names = []
    images = []
    for d in data:
        # if d['name'] is None:
        #     print(d)
        names.append(d['name'].strip())
        images.append(Image.open(d['images'][0]['path']))
    
    name_emb = text_model.encode(names, batch_size=128, show_progress_bar=True, convert_to_numpy=True, device=torch.device('cuda:1'))
    img_emb = img_model.encode(images, batch_size=128, show_progress_bar=True, convert_to_numpy=True, device=torch.device('cuda:1'))

    print(name_emb.shape, img_emb.shape)
    np.save(text_npy, name_emb)
    np.save(img_npy, img_emb)
    
if __name__ == '__main__':
    dir = '../data/data'
    text_model = SentenceTransformer('clip-ViT-B-32-multilingual-v1')
    img_model = SentenceTransformer('clip-ViT-B-32')
    text_npy = 'name_emb.npy'
    img_npy = 'img_emb.npy'
    
    text_model.load_state_dict(torch.load('./ckpts/text_epoch2.pt'))
    img_model.load_state_dict(torch.load('./ckpts/img_epoch2.pt'))
    text_npy = 'name_emb_finetuned.npy'
    img_npy = 'img_emb_finetuned.npy'
    
    precompute_embeddings(dir, text_model, img_model, text_npy, img_npy)
    