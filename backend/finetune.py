from sentence_transformers import SentenceTransformer, util, InputExample, losses
from torch.utils.data import DataLoader, Dataset
from PIL import Image
import json
from tqdm import tqdm
import torch
from torch import optim

text_model = SentenceTransformer('clip-ViT-B-32-multilingual-v1')
img_model = SentenceTransformer('clip-ViT-B-32')

class MyDataset(Dataset):
    def __init__(self, name='data_filtered.jsonl', dir='../data/data'):
        path = f'{dir}/{name}'
        self.names = []
        self.images = []
        with open(path) as f:
            for line in f:
                a = json.loads(line)
                self.names.append(a['name'])
                img_path = f"{dir}/{a['images'][0]['path']}"
                self.images.append(Image.open(img_path))
                
    def __len__(self):
        return len(self.names)
    
    def __getitem__(self, index):
        return {
            'text': self.names[index],
            'image': self.images[index]
        }

def collate_fn(batch):
    return {
        'text': [x['text'] for x in batch],
        'image': [x['image'] for x in batch],
    }

epochs = 3
batch_size = 32

dataset = MyDataset() 
train_dataloader = DataLoader(dataset, batch_size=batch_size, collate_fn=collate_fn, shuffle=True)


loss_img = torch.nn.CrossEntropyLoss()
loss_txt = torch.nn.CrossEntropyLoss()
# optimizer = optim.Adam(model.parameters(), lr=5e-5,betas=(0.9,0.98),eps=1e-6,weight_decay=0.2)

device = torch.device('cuda:1')

text_model = text_model.to(device)
img_model = img_model.to(device)

text_optimizer = optim.AdamW(text_model.parameters(), lr=2e-5)
img_optimizer = optim.AdamW(img_model.parameters(), lr=2e-5)

for epoch in range(epochs):
    print(f"running epoch {epoch}")
    step = 0
    tr_loss = 0
    text_model.train()
    img_model.train()
    pbar = tqdm(train_dataloader, leave=False)
    for batch in pbar:
        step += 1
        text_optimizer.zero_grad()
        img_optimizer.zero_grad()

        texts, images = batch['text'], batch['image']
        texts = util.batch_to_device(text_model.tokenize(texts), device)
        text_features = text_model(texts)['sentence_embedding']
        images = util.batch_to_device(img_model.tokenize(images), device)
        image_features = img_model(images)['sentence_embedding']
        temperature = 0.1
        logits_per_image = util.cos_sim(image_features, text_features) / temperature
        logits_per_text = util.cos_sim(text_features, image_features) / temperature
        # print(image_features.size(), text_features.size(), logits_per_image.size())
        # print(logits_per_image)
        
        ground_truth = torch.arange(len(logits_per_image)).to(device)
        # print(logits_per_image.size(), ground_truth.size())
        total_loss = (loss_img(logits_per_image, ground_truth) + loss_txt(logits_per_text, ground_truth))/2
        total_loss.backward()
        text_optimizer.step()
        img_optimizer.step()
        tr_loss += total_loss.item()
        
        pbar.set_description(f"train batchCE: {total_loss.item()}", refresh=True)
    tr_loss /= step
    
    # step = 0
    # te_loss = 0
    # with torch.no_grad():
    #     model.eval()
    #     test_pbar = tqdm(test_dataloader, leave=False)
    #     for batch in test_pbar:
    #         step += 1
    #         images, texts, _ = batch
    #         images = images.to(device)
    #         texts = clip.tokenize(texts).to(device)
    #         logits_per_image, logits_per_text = model(images, texts)
    #         ground_truth = torch.arange(BATCH_SIZE).to(device)

    #         total_loss = (loss_img(logits_per_image,ground_truth) + loss_txt(logits_per_text,ground_truth))/2
    #         te_loss += total_loss.item()
    #         test_pbar.set_description(f"test batchCE: {total_loss.item()}", refresh=True)
    #     te_loss /= step
        
    # if te_loss < best_te_loss:
    #     best_te_loss = te_loss
    #     best_ep = epoch
    #     torch.save(model.state_dict(), "best_model.pt")
    torch.save(text_model.state_dict(), f"ckpts/text_epoch{epoch}.pt")
    torch.save(img_model.state_dict(), f"ckpts/img_epoch{epoch}.pt")

    print(f"epoch {epoch}, tr_loss {tr_loss}")
    
# torch.save(model.state_dict(), "last_model.pt")
                
# print(text_model.tokenize(['hello']))
# ipt = text_model.tokenize(['hello', 'yes'])
# features = text_model(ipt)
# print(features['sentence_embedding'].size())

# img_ipt = img_model.tokenize([Image.open('../../test_images/sleep.jpg')])
# features = img_model(img_ipt)
# print(features['sentence_embedding'].size())

# data = []
# with open('../data/data/data_filtered.jsonl') as f:
#     pass